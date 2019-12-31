const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${(language && language !== 'en') ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('writing-a-solid-app/writing-a-solid-app', this.props.language)}>
              Writing a Solid App
            </a>
            <a href={this.docUrl('api', this.props.language)}>
              API Reference
            </a>
            <a href={this.docUrl('cheatsheet', this.props.language)}>
              Cheatsheet
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://gitlab.com/vincenttunru/tripledoc">Source code</a>
            <a href={this.docUrl('changelog', this.props.language)}>
              Release notes
            </a>
          </div>
        </section>

        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
