#!/usr/bin/env ruby

require "cgi"
require "date"
require "net/http"
require "rexml/document"
require "uri"
require "yaml"

PUBLICATIONS_PATH = File.expand_path("../publications.md", __dir__)
DBLP_PID = "41/749"
DBLP_XML_URL = "https://dblp.org/pid/#{DBLP_PID}.xml"
DBLP_HTML_URL = "https://dblp.org/pid/#{DBLP_PID}.html"
LOCAL_DBLP_HTML = File.expand_path("../dblp_ Ibrahim Khalil 0001.html", __dir__)
SYNC_ALL = ARGV.include?("--all")
SYNC_EXISTING_ONLY = ARGV.include?("--existing-only")

# Add DBLP labels here when a publication should not appear on the website.
# Example labels match the visible DBLP IDs, without brackets: j174, c74, i37.
HIDDEN_DBLP_IDS = %w[
  i37
].freeze

def fetch(url)
  uri = URI(url)
  5.times do
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == "https") do |http|
      request = Net::HTTP::Get.new(uri)
      request["User-Agent"] = "SPINE-publication-sync/1.0"
      http.request(request)
    end

    case response
    when Net::HTTPSuccess
      return response.body
    when Net::HTTPRedirection
      uri = URI(response["location"])
    else
      raise "Failed to fetch #{url}: #{response.code} #{response.message}"
    end
  end

  raise "Too many redirects while fetching #{url}"
end

def front_matter_and_body(path)
  content = File.read(path)
  match = content.match(/\A---\n(.*?)\n---\n?(.*)\z/m)
  raise "Missing YAML front matter in #{path}" unless match

  [YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true), match[2]]
end

def normalize_title(title)
  title.to_s
       .downcase
       .gsub(/&[a-z]+;/, " ")
       .gsub(/[^a-z0-9]+/, " ")
       .strip
       .squeeze(" ")
end

def normalize_url(url)
  CGI.unescapeHTML(url.to_s.strip).sub(%r{/\z}, "").downcase
end

def doi_from(url)
  decoded = CGI.unescape(normalize_url(url))
  match = decoded.match(%r{(?:doi\.org/|doi:|info:doi/)(10\.\d{4,9}/.+)\z}i)
  return unless match

  match[1].downcase
end

def arxiv_from(url)
  decoded = CGI.unescape(normalize_url(url))
  match = decoded.match(%r{arxiv\.org/(?:abs|pdf)/([0-9]{4}\.[0-9]{4,5})(?:v\d+)?}i)
  return match[1].downcase if match

  match = decoded.match(%r{10\.48550/arxiv\.([0-9]{4}\.[0-9]{4,5})(?:v\d+)?}i)
  match && match[1].downcase
end

def text_at(element, name)
  child = element.elements[name]
  child && child.text.to_s.strip
end

def texts_at(element, name)
  values = []
  element.elements.each(name) { |child| values << child.text.to_s.strip }
  values
end

def clean_author(name)
  name.to_s.sub(/\s+\d{4}\z/, "")
end

def record_type(element)
  return "Informal and Other Publications" if element.name == "article" && element.attributes["publtype"] == "informal"
  return "Journal Articles" if element.name == "article"
  return "Conference and Workshop Papers" if element.name == "inproceedings"

  "Conference and Workshop Papers"
end

def venue_for(element)
  text_at(element, "journal") || text_at(element, "booktitle") || text_at(element, "publisher") || ""
end

def citation_for(record)
  venue = record[:venue].to_s
  year = record[:year].to_s
  pages = record[:pages].to_s
  volume = record[:volume].to_s
  number = record[:number].to_s

  if record[:type] == "Journal Articles" || record[:type] == "Informal and Other Publications"
    citation = venue.dup
    citation << " #{volume}" unless volume.empty?
    citation << "(#{number})" unless number.empty?
    citation << ": #{pages}" unless pages.empty?
    citation << " (#{year})" unless year.empty?
    citation.strip
  else
    citation = venue.dup
    citation << " #{year}" unless year.empty?
    citation << ": #{pages}" unless pages.empty?
    citation.strip
  end
end

def publication_from(record)
  publication = {
    "type" => record[:type],
    "title" => record[:title],
    "authors" => record[:authors],
    "journal" => record[:journal],
    "year" => record[:year],
    "source" => record[:source],
    "dblp_key" => record[:key],
    "citation" => record[:citation]
  }
  publication["dblp_id"] = record[:label] if record[:label]
  publication["booktitle"] = record[:booktitle] unless record[:booktitle].to_s.empty?
  publication["volume"] = record[:volume] unless record[:volume].to_s.empty?
  publication["number"] = record[:number] unless record[:number].to_s.empty?
  publication["pages"] = record[:pages] unless record[:pages].to_s.empty?
  publication
end

def label_map_from(html)
  labels = {}
  html.scan(/<li class="entry[^"]*" id="([^"]+)"[\s\S]*?<div class="nr" id="([^"]+)">\[[^\]]+\]<\/div>/) do |key, label|
    labels[key] = label
  end
  labels
end

def records_from(xml, labels)
  doc = REXML::Document.new(xml)
  records = []

  doc.elements.each("dblpperson/r") do |wrapper|
    element = wrapper.elements.find { |child| child.is_a?(REXML::Element) }
    next unless element

    ees = texts_at(element, "ee")
    venue = venue_for(element)
    record = {
      key: element.attributes["key"].to_s,
      label: labels[element.attributes["key"].to_s],
      type: record_type(element),
      title: text_at(element, "title"),
      authors: texts_at(element, "author").map { |author| clean_author(author) },
      venue: venue,
      journal: text_at(element, "journal") || venue,
      booktitle: text_at(element, "booktitle"),
      volume: text_at(element, "volume"),
      number: text_at(element, "number"),
      pages: text_at(element, "pages"),
      year: text_at(element, "year").to_i,
      source: ees.find { |url| doi_from(url) } || ees.first || "",
      ees: ees
    }
    record[:citation] = citation_for(record)
    records << record
  end

  records
end

def hidden_dblp_id?(id)
  HIDDEN_DBLP_IDS.include?(id.to_s.delete_prefix("[").delete_suffix("]"))
end

def add_index(index, key, record)
  return if key.to_s.empty?

  index[key] ||= record
end

def build_index(records)
  index = {
    doi: {},
    arxiv: {},
    source: {},
    title: {}
  }

  records.each do |record|
    ([record[:source]] + record[:ees]).compact.each do |url|
      add_index(index[:doi], doi_from(url), record)
      add_index(index[:arxiv], arxiv_from(url), record)
      add_index(index[:source], normalize_url(url), record)
    end
    add_index(index[:title], normalize_title(record[:title]), record)
  end

  index
end

def match_record(publication, index)
  source = publication["source"].to_s
  title = publication["title"].to_s

  index[:doi][doi_from(source)] ||
    index[:arxiv][arxiv_from(source)] ||
    index[:source][normalize_url(source)] ||
    index[:title][normalize_title(title)]
end

def update_publication(publication, record)
  if record
    publication.delete("dblp_unmatched")
    publication["type"] = record[:type]
    publication["dblp_id"] = record[:label] if record[:label]
    publication["dblp_key"] = record[:key]
    publication["title"] = record[:title]
    publication["authors"] = record[:authors]
    publication["journal"] = record[:journal]
    if record[:booktitle].to_s.empty?
      publication.delete("booktitle")
    else
      publication["booktitle"] = record[:booktitle]
    end
    publication["volume"] = record[:volume] unless record[:volume].to_s.empty?
    publication.delete("volume") if record[:volume].to_s.empty?
    publication["number"] = record[:number] unless record[:number].to_s.empty?
    publication.delete("number") if record[:number].to_s.empty?
    publication["pages"] = record[:pages] unless record[:pages].to_s.empty?
    publication.delete("pages") if record[:pages].to_s.empty?
    publication["year"] = record[:year]
    publication["source"] = record[:source]
    publication["citation"] = record[:citation]
  else
    publication["dblp_unmatched"] = true
    publication["pages"] ||= publication["volume"]
    publication["citation"] ||= [publication["journal"], publication["volume"], "(#{publication["year"]})"].compact.join(" ")
  end
end

data, body = front_matter_and_body(PUBLICATIONS_PATH)
publications = data.fetch("publications")

xml = fetch(DBLP_XML_URL)
html = if File.exist?(LOCAL_DBLP_HTML)
  File.read(LOCAL_DBLP_HTML)
else
  fetch(DBLP_HTML_URL)
end

all_records = records_from(xml, label_map_from(html))
records = all_records.reject { |record| hidden_dblp_id?(record[:label]) }
if SYNC_ALL && SYNC_EXISTING_ONLY
  raise "Use either --all or --existing-only, not both"
end

if SYNC_ALL || !SYNC_EXISTING_ONLY
  data["publications"] = records.map { |record| publication_from(record) }
  puts "DBLP records available: #{all_records.size}"
  puts "Hidden DBLP records: #{all_records.size - records.size}"
  puts "Publications written: #{data["publications"].size}"
  puts "Unlabeled DBLP records: #{data["publications"].count { |publication| publication["dblp_id"].to_s.empty? }}"
else
  index = build_index(records)
  matched = 0
  unmatched = []
  publications.reject! { |publication| hidden_dblp_id?(publication["dblp_id"]) }

  publications.each do |publication|
    record = match_record(publication, index)
    matched += 1 if record
    unmatched << publication["title"] unless record
    update_publication(publication, record)
  end

  puts "DBLP records available: #{all_records.size}"
  puts "Hidden DBLP records: #{all_records.size - records.size}"
  puts "Publications preserved: #{publications.size}"
  puts "Matched existing publications: #{matched}"
  puts "Unmatched existing publications: #{unmatched.size}"
  unmatched.each { |title| warn "Unmatched: #{title}" }
end

yaml = YAML.dump(data, line_width: -1).sub(/\A---\n/, "")
File.write(PUBLICATIONS_PATH, "---\n#{yaml}---\n#{body}")
