import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import './App.css'; 

const axios = require('axios');
const URL = 'http://bl.thexyz.com:49155/'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Thexyz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       domain: '',
       status: -1,
    }
    this.SearchDomain = this.SearchDomain.bind(this);
    this.InputChageDomain = this.InputChageDomain.bind(this);
    this.getResultText = this.getResultText.bind(this);
    this.getResultClass = this.getResultClass.bind(this);
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  ValidateIPaddress(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
      return (true)  
    }  
    return (false)  
  } 

  getResultText() {
    const type = this.validateEmail(this.state.domain) ? 'email' : this.ValidateIPaddress(this.state.domain) ? 'ip' : 'domain'
    if (this.state.status === 1) {
      return `This ${type} exist in blacklist.`;
    } else if (this.state.status === 0) {
      return `This ${type} doesn't exist in blacklist.`;
    } else return '';
  }

  getResultClass() {
    if (this.state.status === 1) {
      return 'result_good';
    } else if (this.state.status === 0) {
      return `result_bad`;
    } else return '';
  }

  SearchDomain() {
    const _this = this
    axios.request({
      url: "checkdomain",
      method: "post",
      baseURL: URL,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      data: {
        domain: _this.state.domain
      },
    }).then((res) => {
      this.setState({
        status: res.data.success
      })
    }).catch((error) => {
      this.setState({
        status: 0
      })
    })
  }

  InputChageDomain(value) {
    this.setState({
      domain: value,
      status: -1
    })
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className="paper">
          <Typography component="h1" variant="h5">
            Blacklist Check
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="text"
            label="Please Input Domain Name"
            name="text"
            autoComplete="text"
            value={this.state.domain}
            autoFocus
            onChange={(e) => this.InputChageDomain(e.target.value)}
          />
          <div className={this.getResultClass()}>
            {this.getResultText()}
          </div>
          <div className="button_wrapper"
            onClick={this.SearchDomain}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="submit"
            >
              Search
            </Button>
          </div>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}