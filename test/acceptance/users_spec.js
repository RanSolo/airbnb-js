'use strict';

process.env.DBNAME = 'note2-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var User;
var sue;

describe('users', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      sue = new User({email:'sue@aol.com', password:'abcd'});
      sue.register(function(err){
        done();
      });
    });
  });

  describe('GET /register', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('should register a user', function(done){
      request(app)
      .post('/register')
      .field('email', 'bob@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
    it('should not register a user due to duplicate', function(done){
      request(app)
      .post('/register')
      .field('email', 'sue@aol.com')
      .field('password', 'abcd')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('User Authentication');
        done();
      });
    });
  });

  describe('GET/login', function(){
    it('should display the loginpage', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST/login', function(){
    it('should login a user', function(done){
      request(app)
      .post('/login')
      .field('email', 'sue@aol.com')
      .field('password', 'abcd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
    it('should not login a user due to bad login', function(done){
      request(app)
      .post('/login')
      .field('email', 'bob@aol.com')
      .field('password', '134')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });

  });

});

