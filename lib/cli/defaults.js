export default {
  standalone: true,
  parallel: false,
  port: 4444,
  hostname: 'localhost',
  username: null,
  password: null,
  browsers: [{
    browserName: 'chrome'
  }],
  script: 'echo No script specified'
}
