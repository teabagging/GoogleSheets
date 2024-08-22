import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import clsx from 'clsx';

import styles from './styles.module.css';

const features = [
  {
    title: 'Go Sheets',
    content:
      "Google Sheets: Online Spreadsheets & Templates.",
  },
  {
    title: 'What Is GoogleSheets',
    content:
      'The Google Sheets API is a RESTful interface that lets you read and modify a spreadsheet',
  },
  {
    title: 'GoogleSheets',
    content:
      'Create, edit, and collaborate on spreadsheets with the Google Sheets app. With Sheets you can',
  },
];
const components = [
  {
    title: 'Create AI📚',
    content: "🔥Bringing AI to the world.",
    url: 'https://ai.543x.com/',
  },
  {
    title: 'Swap📝',
    content: '🔥THE MONETARY FUTURE:AT THE INTERSECTION OF FREE BANKING, CRYPTOGRAPHY, AND DIGITAL CURRENCY ',
    url: 'https://s.543x.com/',
  },
  {
    title: 'What is Bitcoin🐱',
    content: '🔥Bitcoin: A Peer-to-Peer Electronic Cash System',
    url: 'https://www.543x.com/',
  },
  {
    title: 'GoogleSheets🧠',
    content: '🔥Set up a modern web app by running one command.',
    url: 'https://f.543x.com/',
  },
  {
    title: 'library for web 💻',
    content: '🔥The library for web and native user interfaces.',
    url: 'https://r.543x.com/',
  },
  {
    title: 'Create Solana🚀',
    content: '🔥Bringing Blockchain to the World..',
    url: 'https://b.543x.com/',
  },
  {
    title: 'Create React📗',
    content: '🔥Set up a modern web app by running one command..',
    url: 'https://e.543x.com/',
  },
  {
    title: 'Firebase💼',
    content: '🔥Google tools help build applications, improve quality and efficiency',
    url: 'https://d.543x.com/',
  },
  {
    title: 'Create React App🐛',
    content: '🔥Bringing modern web app  to the World.',
    url: 'https://c.543x.com/',
  },
];
function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      permalink={'/'}
      description={'Set up a modern web app by running one command.'}
    >
      <div className={clsx('hero hero--dark', styles.heroBanner)}>
        <div className="container">
          <img
            className={clsx(styles.heroBannerLogo, 'margin-vert--md')}
            alt="GoogleSheets logo"
            src={useBaseUrl('img/logo.svg')}
          />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.getStarted}>
            <Link
              className="button button--outline button--primary button--lg"
              to={useBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      {features && features.length && (
        <div className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map(({ title, content }, idx) => (
                <div key={idx} className={clsx('col col--4', styles.feature)}>
                  <h2>{title}</h2>
                  <p>{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
     
     {components.length > 0 && (
        <div className={styles.features}>
          <div className="container">
            <div className="row">
              {components.map(({ title, url, content }, idx) => (
                <div key={idx} className={clsx('col col--4', styles.feature)}>
                  <div className={styles.card}>
                    <h3>{title}</h3>
                    <p>{content}</p>
                    <Link className="button button--primary" to={url}>
                    Visit website
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Home;
