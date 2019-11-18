/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/undraw_hiring_cyhs.svg`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('writing-a-solid-app/writing-a-solid-app')}>Get started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${doc}`;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: 'No need to know RDF',
            image: `${baseUrl}img/undraw_teaching_f1cm.svg`,
            imageAlign: 'top',
            title: 'Easy to learn',
          },
          {
            content: 'Extensive documentation to help get you on your feet in no time',
            image: `${baseUrl}img/undraw_reading_book_4wjf.svg`,
            imageAlign: 'top',
            title: 'Well documented',
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    const quickStartContent = `
It is recommended to install Tripledoc together with:

- [rdf-namespaces](https://www.npmjs.com/package/rdf-namespaces) for easy access
to common vocabularies and their terms.
- [solid-auth-client](https://www.npmjs.com/package/solid-auth-client) to handle authentication.


    npm install --save tripledoc rdf-namespaces solid-auth-client

The two primary data structures in Tripledoc are:

- [TripleDocument](api/interfaces/tripledocument/), representing an
[RDF Document](https://www.w3.org/TR/2014/REC-rdf11-concepts-20140225/#dfn-rdf-document).
- [TripleSubject](api/interfaces/triplesubject/). a node in the RDF graph that can be queried for
[Triples](https://www.w3.org/TR/2014/REC-rdf11-concepts-20140225/#dfn-rdf-triple)
in which it occurs as the Subject.


For a more thorough introduction, read our [**guide to writing Solid Apps**](writing-a-solid-app/writing-a-solid-app).
`;
    const QuickStart = () => (
      <Container
        padding={['bottom', 'top']}
        id="quickstart"
        background="light"
      >
        <MarkdownBlock>
          {quickStartContent}
        </MarkdownBlock>
      </Container>
    );

  const Demo = () => (
    <iframe
     src="https://codesandbox.io/embed/youthful-proskuriakova-1tlqw?autoresize=1&hidenavigation=1&module=%2Fsrc%2Findex.ts&theme=light"
     style={{width: '100%', height: '500px', border: 0, overflow: 'hidden'}}
     title="tripledoc-quickstart"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    ></iframe>
  );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <QuickStart/>
          <Demo/>
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
