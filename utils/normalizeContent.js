function normalizeContent(input = '') {
    return String(input)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

module.exports = normalizeContent;
