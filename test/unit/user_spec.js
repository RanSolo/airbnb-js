/*jshint expr:true */
'use strict';

process.env.DBNAME = 'airbnb-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var User;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      var bob = new User({role:'host', email:'bob@nomail.com', password:'1234'});
      bob.register(function(err){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      var u1 = new User({role:'host', email:'bob@nomail.com', password:'1234'});
      expect(u1).to.be.instanceof(User);
      expect(u1.email).to.equal('bob@nomail.com');
      expect(u1.password).to.equal('1234');
      expect(u1.role).to.equal('host');
    });
  });

  describe('register', function(){
    it('should register a new User', function(done){
      var u1 = new User({role:'host', email:'ransolo@me.com', password:'1234'});
      u1.register(function(err, body){
        expect(err).to.not.be.ok;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        body = JSON.parse(body);
//        expect(body._id).to.be.ok;
        console.log(body);
        done();
      });
    });
    it('shoud not insert duploicate user into mongo', function(done){
      var u1 = new User({role:'host', email:'bob@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });
  });

});
