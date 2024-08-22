

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GoogleSheets',
  tagline: 'Online, collaborative spreadsheets',
  url: 'https://g.543x.com',
  favicon: 'img/logo.svg',

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AI', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/teabagging/GoogleSheets/edit/main',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/teabagging/GoogleSheets/edit/main',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        googleAnalytics: {
          trackingID: 'G-5SBZ5D0DT2',
          anonymizeIP: true
        },
        gtag: {
          trackingID: 'G-5SBZ5D0DT2',
          anonymizeIP: true
        }
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo.svg',
      announcementBar: {
        id: 'support_ukraine',
        content:
          '🥳<a target="_blank" rel="noopener noreferrer" href="https://www.543x.com">www.543x.com</a>🥳',
        backgroundColor: '#20232a',
        textColor: '#fff',
        isCloseable: false,
      },
      navbar: {
        title: 'GoogleSheets',
        logo: {
          alt: 'GoogleSheets Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/docs/Google%20Sheet%20formulas/Google%20Sheets%20Formulas%20Tips', label: 'Formulas', position: 'right'},
          {to: '/docs/sheetjs/cheat', label: 'GoogleSheets', position: 'right'},
          {to: '/docs/Google%20Sheets/Google%20Sheets%20function%20list', label: 'functionlist', position: 'right'},
          { href: 'https://www.543x.com', label: 'Help', position: 'right' },
          {
            href: 'https://github.com/teabagging/GoogleSheets',
            label: 'GitHub',
            position: 'right',
          },

        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Get Started',
                href: 'https://ai.543x.com',
              },
              {
                label: 'Learn React',
                href: 'https://r.543x.com',
              },
              {
                label: 'Quick Start',
                href: 'https://e.543x.com',
              },
              {
                label: 'Logo by',
                href: 'https://www.z2.pw',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'you',
                href: 'https://c.543x.com',
              },
              {
                label: 'GitHub Discussions',
                href: 'https://y.543x.com',
              },
              {
                label: 'Pump',
                href: 'https://d.543x.com',
              },
              {
                label: 'Swap',
                href: 'https://s.543x.com',
              },
            ],
          },
          {
            title: 'Social',
            items: [
              {
                label: 'GitHub',
                href: 'https://b.543x.com',
              },
              {
                label: 'Conduct',
                href: 'https://btc.543x.com',
              },
              {
                label: 'the Team',
                href: 'https://eth.543x.com',
              },
              {
                label: 'Contributors',
                href: 'https://f.543x.com',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://d.543x.com',
              },
              {
                label: 'React Native',
                href: 'https://doge.543x.com',
              },
              {
                label: 'PEPE',
                href: 'https://pepe.543x.com',
              },
              {
                label: 'Privacy',
                href: 'https://no.543x.com',
              },
            ],
          },
        ],
        logo: {
          alt: 'AI Open Source Logo',
          src: 'img/oss_logo.svg',
        },
        copyright: `Copyright © ${new Date().getFullYear()} GoogleSheets, Inc.`,
      },


      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
