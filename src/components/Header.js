import React from 'react'
import { AppBar, Toolbar, Grid, InputBase, makeStyles, Typography } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import { AddShoppingCart } from '@material-ui/icons';


const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#000000'        
    },

    icon: {
        marginRight: '10px',
        color:'white'
    },
    searchInput: {
        //opacity: '0.6',
        padding: `0px ${theme.spacing(1)}px`,        
        color: 'white',
        fontSize: '1rem',
        '&:hover': {
            backgroundColor: '#000000' //'#f2f2f2'
        },
        '& .MuiSvgIcon-root': {
            color: 'white',
            marginRight: theme.spacing(1)
        }
    }
}))

export default function Header() {

    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.root} elevation={0}>
            <Toolbar>
                <Grid container alignItems="left">
                    <Grid item>
                        <AddShoppingCart className={classes.icon} />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" className={classes.icon}>My NFT Garage</Typography>
                    </Grid>
                    <Grid item sm></Grid>
                    <Grid item>
                        <InputBase
                            placeholder="Search topics"
                            className={classes.searchInput}
                            startAdornment={<SearchIcon fontSize="small" />}
                        />
                    </Grid>                    
                    <Grid item sm>
                        {/* <Button variant="contained" onclicked={handlePurchase}>BUY MY TOKEN</Button> */}
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}