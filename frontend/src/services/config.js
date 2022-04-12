import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { grey } from '@mui/material/colors';

const muiPostDetailScreenTheme = {
    typography: {
      body1: {
        fontSize: '1.2rem'
      },
      h3: {
          fontSize: '2.3rem',
          fontWeight: 500
      }
    },
    palette: {
        secondary: {
            main: grey[500]
        }
    }
  }

const markdownBaseOptions = {
    overrides: {
        h1: {
            component: Typography,
            props: {
                variant: 'h4',
                component: 'h2',
            },
        },
        h2: {
            component: Typography,
            props: {
                variant: 'h5',
                component: 'h3',
            },
        },
        h3: {
            component: Typography,
            props: {
                variant: 'h6',
                component: 'h4',
            },
        },
        table: {
            component: Table,
            props: {
                size: 'small',
            }
        },
        thead: {
            component: TableHead,
        },
        tr: {
            component: TableRow,

        },
        th: {
            component: TableCell,
            props: {
                style: {},
                align: 'left'
            }
        },
        tbody: {
            component: TableBody
        },
        td : {
            component: TableCell,
            props: {
                style: {},
                align: 'left'
            }
        },
        blockquote: {
            props: {
                className: 'markdown'
            }
        },
    },
}

const exportedConfigs = {
    markdownBaseOptions,
    muiPostDetailScreenTheme,
};

export default exportedConfigs;
