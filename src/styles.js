import { makeStyles } from '@material-ui/core/styles';
import autoprefixer from 'autoprefixer';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 6)
  },

  mytoolbar: {    
    backgroundColor: 'black'
  },

  menubar: {
    variant:"h4",
    align:"center",
    color:"primary"    
  },

  icon: {
    marginRight: '20px',
    color: 'white',
    fontSize: '25px'

  },

  button: {
    marginTop: '40px'

  },

  cardGrid: {
    padding: '20px 0'
  },

  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },

  cardMedia: {
    height: 100,
    width: 100,
    margin: 'auto',
    paddingTop: '56.25%' //16:9
  },

  cardContent: {
    flexGrow: 1,
  },

  //   search: {
  //     position: 'relative',
  //     borderRadius: theme.shape.borderRadius,
  //     backgroundColor: alpha(theme.palette.common.white, 0.15),
  //     '&:hover': {
  //       backgroundColor: alpha(theme.palette.common.white, 0.25),
  //     },
  //     marginLeft: 0,
  //     width: '100%',
  //     [theme.breakpoints.up('sm')]: {
  //       marginLeft: theme.spacing(1),
  //       width: 'auto',
  //     },
  //   },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

}));

export default useStyles;