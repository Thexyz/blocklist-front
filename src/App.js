import React from 'react'
import axios from 'axios'

import './App.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL
const URL = backendUrl || 'https://bl.thexyz.com:49156/'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      domain: '',
      status: -1,
    }
    this.SearchDomain = this.SearchDomain.bind(this)
    this.InputChageDomain = this.InputChageDomain.bind(this)
    this.getResultText = this.getResultText.bind(this)
    this.getResultClass = this.getResultClass.bind(this)
  }

  validateEmail(email) {
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  ValidateIPaddress(ipaddress) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
      )
    ) {
      return true
    }
    return false
  }

  getResultText() {
    const type = this.validateEmail(this.state.domain)
      ? 'email'
      : this.ValidateIPaddress(this.state.domain)
      ? 'ip'
      : 'domain'
    if (this.state.status === 1) {
      return `This ${type} does exist in the blocklist.`
    } else if (this.state.status === 0) {
      return `This ${type} is not currently listed in the blocklist.`
    } else return ''
  }

  getResultClass() {
    if (this.state.status === 1) {
      return 'result_good'
    } else if (this.state.status === 0) {
      return `result_bad`
    } else return ''
  }

  SearchDomain() {
    const _this = this
    axios
      .request({
        url: 'checkdomain',
        method: 'post',
        baseURL: URL,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          domain: _this.state.domain,
        },
      })
      .then((res) => {
        this.setState({
          status: res.data.success,
        })
      })
      .catch((error) => {
        this.setState({
          status: 0,
        })
      })
  }

  InputChageDomain(value) {
    this.setState({
      domain: value,
      status: -1,
    })
  }

  render() {
    return (
      <div className="form">
        <div className="left">
          <div className="form-group">
            Enter domain, IP or email address
            <br />
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={this.state.domain}
              required
              onChange={(e) => this.InputChageDomain(e.target.value)}
            />
            <br />
          </div>
          <div className={this.getResultClass()}>{this.getResultText()}</div>
          <div className="button_wrapper" onClick={this.SearchDomain}>
            <div className="form-group">
              <input
                type="submit"
                className="btn btn-info btn-block"
                value="Check"
              />
              <br />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
