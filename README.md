Web automation is hard. Performing E2E testing on web apps can be daunting, scary and unreliable, involving many different moving parts. Any of this sound familiar? __You might be suffering from seleniumitis!__

> ### seleniumitis  
> __/sɪˈliːnɪəmʌɪtɪs/__  
> _noun_  
> &nbsp;&nbsp;&nbsp;the fear of web automation

Luckily, thanks to developments in medical science, we now have a cure! Introducing...


# react-driver [![Build Status](https://travis-ci.org/QubitProducts/react-driver.svg)](https://travis-ci.org/QubitProducts/react-driver)

`react-driver` does three things:

* It lets you perform `react.js`-aware web automations, removing the need for unreliable timeouts/intervals and enabling component-based element selectors thanks to [enzyme](http://airbnb.io/enzyme/)
* It lets you write these automations using whatever test framework you like
* It can download and run the selenium-standalone server automagically for you, or make use of remote selenium grids such as Saucelabs and Browserstack

Oh, and it also integrates with `redux` and `react-router`!


### Why?

Yeah ok... it might not be obvious why any of this stuff matters. I mean, we already have amazing libraries like [wd](https://github.com/admc/wd), [webdriverio](http://webdriver.io/) and [nightwatch.js](http://nightwatchjs.org/) that make writing web automation tests super simple. They all, however, fall down in three key areas:

1. You have to download and run your own selenium server (with all the drivers) if you want to perform the automations locally
1. They are context-unaware; most of them have no understanding of the application they are running against, meaning assertions and instructions are 'dumb' and can't make use of the rich APIs now available from libraries like `react.js`
1. The testing and assertion functionality available to you is restricted to whatever the library supports. Wanna use `mocha` with `nightwatch`? Nope.


### What does it look like?

#### 1. Include the tiny registration module in your app

```js
import register from 'react-driver/register'

let tree = ReactDOM.render(<App />, container)
register('myApp', tree)
```

#### 2. Write your automations with a clean and simple API using whatever testing libraries you want

```js
import {load, quit, select, action, transition} from 'react-driver'

describe('foo.com', function () {
  before(() => load('http://foo.com', 'myApp'))

  it('should add a new foo, then go to bar', async function () {
    let button = await select('AddFooButton')
    button.click()
    await action('ADDFOO_SUCCESS')
    let foos = await select('FooItem')
    expect(foos).to.have.length(1)
    await transition('bar')
  })

  after(quit)
})
```

#### 3. Run them with the `react-driver` CLI

```react-driver mocha```

![](http://g.recordit.co/Vpj2x1jFM5.gif)


### Great! Can I use it yet?

I'd love to say yes, but we aren't quite there yet. A public alpha is expected to be available in early January. We are, however, fully open to initial feedback on the idea so please open an issue to get involved!


### Want to work on this for your day job?

This project was created by the Engineering team at [Qubit](https://qubit.com). As we use open source libraries, we make our projects public where possible.

We’re currently looking to grow our team, so if you’re a JavaScript engineer and keen on ES2016 React+Redux applications and Node micro services, why not get in touch? Work with like minded engineers in an environment that has fantastic perks, including an annual ski trip, yoga, a competitive foosball league, and copious amounts of yogurt.

Find more details on our [Engineering site](https://eng.qubit.com). Don’t have an up to date CV? Just link us your Github profile! Better yet, send us a pull request that improves this project.
