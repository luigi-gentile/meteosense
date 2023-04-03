import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(6),
    },
    icon: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

const Footer = () => {
    const classes = useStyles();
    const year = new Date().getFullYear();

    return (
        <footer className={classes.footer}>
            <Typography variant="subtitle1" align="center" gutterBottom>
                &copy; {year} <Link href="http://www.poliba.it/" target="_blank">Politecnico di Bari</Link> - Tutti i diritti riservati
            </Typography>
        </footer>
    );
};

export default Footer;