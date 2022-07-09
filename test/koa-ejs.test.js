/*!
 * koa-ejs - test/koa-ejs.test.js
 * Copyright(c) 2017 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */

const render = require('..')
const request = require('supertest')
const Koa = require('koa')

describe('test/koa-ejs.test.js', function () {
  describe('init()', function () {
    const app = new Koa()
    it('should throw error if no root', function () {
      (function () {
        render(app)
      }).should.throw('settings.root required');

      (function () {
        render(app, {})
      }).should.throw('settings.root required')
    })

    it('should init ok', function () {
      render(app, {
        root: __dirname,
        open: '{{',
        close: '}}'
      })
      // eslint-disable-next-line no-unused-expressions
      app.context.render.should.be.Function
    })
  })

  describe('server', function () {
    describe('with default node.js fs module', () => {
      it('should render page ok', function (done) {
        const app = require('../example/app')
        request(app)
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/<title>koa ejs<\/title>/)
          .expect(/Dead Horse/)
          .expect(/Imed Jaberi/, done)
      })
      it('should render page ok with async functions', function (done) {
        const app = new Koa()
        render(app, {
          root: 'example/view',
          viewExt: 'html',
          layout: false,
          async: true
        })

        app.use(async function (ctx) {
          await ctx.render('async', {
            async sayHello (name) {
              return `Hello, ${name}`
            }
          })
        })
        request(app.callback())
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/Hello, Jack/, done)
      })
      it('should render page ok with custom open/close', function (done) {
        const app = new Koa()
        render(app, {
          root: 'example/view',
          layout: 'template.oc',
          viewExt: 'html',
          delimiter: '?'
        })

        app.use(async function (ctx) {
          await ctx.render('user.oc', {
            user: { name: 'Zed Gu' }
          })
        })
        request(app.callback())
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/Zed Gu/, done)
      })
      it('should render page ok with `viewExt` option supporting `include` directive', function (done) {
        const app = new Koa()
        render(app, {
          root: 'example/view',
          layout: 'template',
          viewExt: 'html',
          cache: false
        })

        app.use(function (ctx, next) {
          ctx.state = ctx.state || {}
          ctx.state.ip = ctx.ip
          return next()
        })

        app.use(async function (ctx) {
          const users = [{ name: 'Dead Horse' }, { name: 'Runrioter Wung' }]
          await ctx.render('content.noext', {
            users
          })
        })
        request(app.callback())
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/Dead Horse/)
          .expect(/Runrioter Wung/, done)
      })
    })

    describe('with custom node.js fs module like', () => {
      it('should render page ok', function (done) {
        const app = require('../example/app-with-custom-fs-module')
        request(app)
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/<title>koa ejs<\/title>/)
          .expect(/Dead Horse/)
          .expect(/Imed Jaberi/, done)
      })
      it('should render page ok with async functions', function (done) {
        const app = new Koa()
        render(app, {
          root: 'example/view',
          fs: require('mz/fs'),
          viewExt: 'html',
          layout: false,
          async: true
        })

        app.use(async function (ctx) {
          await ctx.render('async', {
            async sayHello (name) {
              return `Hello, ${name}`
            }
          })
        })
        request(app.callback())
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/Hello, Jack/, done)
      })
      it('should render page ok with custom open/close', function (done) {
        const app = new Koa()
        render(app, {
          root: 'example/view',
          fs: require('mz/fs'),
          layout: 'template.oc',
          viewExt: 'html',
          delimiter: '?'
        })

        app.use(async function (ctx) {
          await ctx.render('user.oc', {
            user: { name: 'Zed Gu' }
          })
        })
        request(app.callback())
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/Zed Gu/, done)
      })
      it('should render page ok with `viewExt` option supporting `include` directive', function (done) {
        const app = new Koa()
        render(app, {
          root: 'example/view',
          fs: require('mz/fs'),
          layout: 'template',
          viewExt: 'html',
          cache: false
        })

        app.use(function (ctx, next) {
          ctx.state = ctx.state || {}
          ctx.state.ip = ctx.ip
          return next()
        })

        app.use(async function (ctx) {
          const users = [{ name: 'Dead Horse' }, { name: 'Runrioter Wung' }]
          await ctx.render('content.noext', {
            users
          })
        })
        request(app.callback())
          .get('/')
          .expect(200)
          .expect('content-type', 'text/html; charset=utf-8')
          .expect(/Dead Horse/)
          .expect(/Runrioter Wung/, done)
      })
    })
  })
})
