import { createTheme } from '@material-ui/core/styles'
import {
  montserratRegular,
  montserratMedium,
  montserratSemiBold,
  montserratBold,
  openSansBold,
} from './fontFace'

// Define Theme
const theme = createTheme({
  palette: {
    common: {
      grey: 'hsla(199, 12%, 71%, 1)',
      black: 'hsla(0, 0%, 0%, 1)',
    },
    primary: {
      lighter: 'hsla(169, 47%, 92%, 1.00)',
      light: 'hsla(168, 50%, 83%, 1)',
      main: 'hsla(168, 54%, 48%, 1)',
    },
    secondary: {
      light: 'hsla(194, 68%, 96%, 1)',
      main: 'hsla(199, 100%, 22%, 1)',
    },
    success: {
      main: 'hsla(136, 53%, 43%, 1)',
    },
    error: {
      light: 'hsla(11, 83%, 70%, 1)',
      main: 'hsla(0, 66%, 56%, 1)',
    },
    pending: {
      main: 'hsla(36, 73%, 55%, 1.00)',
    },
    text: {
      primary: 'hsla(199, 100%, 22%, 1)',
    },
    background: {
      default: 'white',
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: 16,
  },
  shape: {
    borderRadius: '8px',
  },
  boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
  boxShadow2: '0px 8px 24px rgba(0, 0, 0, 0.08)',
})

// Typography
theme.typography.h1 = {
  fontFamily: 'Open Sans, sans-serif',
  fontSize: '3.5rem',
  fontWeight: 700,
  lineHeight: 1.14,
}
theme.typography.h2 = {
  fontFamily: 'Open Sans, sans-serif',
  fontSize: '2rem',
  fontWeight: 700,
  lineHeight: 1.5,
}
theme.typography.h3 = {
  fontFamily: 'Open Sans, sans-serif',
  fontSize: '1.5rem',
  fontWeight: 700,
  lineHeight: 1.67,
}
theme.typography.h4 = {
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: 1.5,
}
theme.typography.h5 = {
  fontSize: '1rem',
  fontWeight: 500,
  lineHeight: 1.5,
}
theme.typography.h6 = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: 1.16,
}
theme.typography.body1 = {
  fontWeight: 500,
}
theme.typography.caption = {
  fontSize: '0.75rem',
  lineHeight: 1.16,
}

// Props
theme.props = {
  MuiContainer: {
    // maxWidth: false,
  },
  MuiAppBar: {
    color: 'default',
  },
  MuiInputLabel: {
    shrink: true,
  },
  MuiToolbar: {
    disableGutters: true,
  },
  MuiButtonBase: {
    disableRipple: true,
  },
  MuiButton: {
    disableElevation: true,
  },
  MuiInput: {
    disableUnderline: true,
  },
}

// Overrides
theme.overrides = {
  MuiCssBaseline: {
    '@global': {
      '@font-face': [
        montserratRegular,
        montserratMedium,
        montserratSemiBold,
        montserratBold,
        openSansBold,
      ],
    },
  },
  MuiDivider: {
    root: {
      backgroundColor: theme.palette.grey[200],
    },
  },
  MuiFormLabel: {
    root: {
      fontWeight: 500,
      color: theme.palette.secondary.main,
      marginBottom: theme.spacing(0.75),
    },
  },
  MuiTextField: {
    root: {
      '& .MuiInputBase-root': {
        border: 'none',
        height: '100%',
      },
    },
  },
  MuiInputBase: {
    root: {
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.grey[300]}`,
      padding: theme.spacing(0.5, 2),
    },
    multiline: {
      padding: theme.spacing(1.5, 2),
    },
  },
  MuiTypography: {
    paragraph: {
      marginBottom: theme.spacing(2),
    },
  },
  MuiButton: {
    root: {
      padding: theme.spacing(2, 7),
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    outlined: {
      padding: theme.spacing(2, 5),
    },
    label: {
      fontWeight: 600,
      textTransform: 'capitalize',
    },
  },
}

export default theme
