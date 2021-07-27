import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      {new Date().getFullYear()}
      {'   '}
      <Link color="inherit" href="https://material-ui.com/" >
        MyNFT Garage
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({  
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
  },
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (      
      <footer className={classes.footer}>
        <Container maxWidth="sm">          
          <Copyright />
        </Container>
      </footer>
    
  );
}