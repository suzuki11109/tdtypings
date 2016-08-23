import {expect} from "chai";
import * as td from "testdouble";

class SavesProblem {
  save(value: string) {

  }
}

describe('testdouble', function(){

  describe('Object', () => {
    it('constructor', () => {
      let savesProblem: SavesProblem;
      savesProblem = td.object(SavesProblem);
      td.when(savesProblem.save('some problem')).thenReturn('saved problem');

      expect(savesProblem.save('some problem')).to.equal('saved problem');
    });

    it('someObjectWithFunctions', function() {
      var fish = {
        eat: function(){},
        swim: function(){},
        details: {
          age: 10,
          name: 'goldie'
        }
      };

      var fish = td.object(fish);

      expect(fish.details.age).to.equal(10);
      expect(fish.details.name).to.equal("goldie");
    });

    it('functionNames', function() {
      var cat = td.object(['meow', 'purr']);

      td.when(cat.meow()).thenReturn('meowth');
      expect(cat.meow()).to.equal('meowth');
    });
  });

  describe('Stubbing', () => {

    it('multi stubbing', function(){
      var quack = td.function('quack');
      td.when(quack('soft')).thenReturn('quack')
      td.when(quack('soft', 2)).thenReturn('quack quack')
      td.when(quack('soft', 2, 'hard', 3)).thenReturn('quack quack QUACK QUACK QUACK')

      expect(quack("soft")).to.equal("quack");
      expect(quack("soft", 2)).to.equal("quack quack");
      expect(quack("soft", 2, 'hard', 3)).to.equal("quack quack QUACK QUACK QUACK");
    });

    it('one line stubbing', () => {
      let woof = td.when(td.function()()).thenReturn('bark');
      expect(woof()).to.equal("bark");
    });

    it('sequential stubbing', () => {
      var randomSound = td.function('randomSound');

      td.when(randomSound()).thenReturn('quack', 'honk', 'moo');

      expect(randomSound()).to.equal('quack');
      expect(randomSound()).to.equal('honk');
      expect(randomSound()).to.equal('moo');
    });

    it('argument matchers', () => {
      function sitInTraffic(horn){
        return horn() + '!'
      }

      var horn = td.function()
      td.when(horn()).thenReturn('beep')
      expect(sitInTraffic(horn)).to.equal('beep!');

      td.when(horn()).thenReturn('honk')
      expect(sitInTraffic(horn)).to.equal('honk!');
    });

    it('matchers anything', () => {
      var bark = td.function()

      td.when(bark(td.matchers.anything())).thenReturn('woof')


      expect(bark(1)).to.equal('woof');
      expect(bark('lol')).to.equal('woof');
      expect(bark()).to.be.undefined;
    });

    it('matchers isA', () => {
      var eatBiscuit = td.function();

      td.when(eatBiscuit(td.matchers.isA(Number))).thenReturn('yum');

      expect(eatBiscuit(5)).to.equal('yum');
      expect(eatBiscuit('stuff')).to.be.undefined;
      expect(eatBiscuit()).to.be.undefined;
    });

    it('matchers contains', () => {
      var yell = td.function();

      td.when(yell(td.matchers.contains('ARGH'))).thenReturn('AYE');

      expect(yell('ARGHHHHHHH')).to.equal('AYE');
      expect(yell('ARG')).to.be.undefined;

      var jellyBeans = td.function();

      td.when(jellyBeans(td.matchers.contains('popcorn', 'apple'))).thenReturn('yum');

      expect(jellyBeans(['grape', 'popcorn', 'strawberry', 'apple'])).to.equal('yum');
      expect(jellyBeans(['grape', 'popcorn', 'strawberry'])).to.be.undefined;

      var brew = td.function();

      td.when(brew(td.matchers.contains({container: {size: 'S'}}))).thenReturn('small coffee');

      expect(brew({ingredient: 'beans', container: { type: 'cup', size: 'S'}})).to.equal('small coffee');
      expect(brew({ingredient: 'beans', container: { type: 'cup', size: 'L'}})).to.be.undefined;
      expect(brew({})).to.be.undefined;
    });

    it('matchers argThat', () => {
      var pet = td.function();

      td.when(pet(td.matchers.argThat(animals => animals.length > 2))).thenReturn('goood');

      expect(pet(['cat', 'dog', 'horse'])).to.equal('goood');
      expect(pet(['cat', 'dog'])).to.be.undefined;
      expect(pet({length: 81})).to.equal('goood');
    });

    it('matchers not', () => {
      var didSucceed = td.function();

      didSucceed(true);

      td.verify(didSucceed(td.matchers.not(false)))

      var didFailed = td.function();

      didFailed('Jane');

      td.verify(didFailed(td.matchers.not('Janes')))
    });

    it('Stubbing callback APIs', () => {
      function deleteFiles(pattern, glob, rm) {
        glob(pattern, function(er, files) {
          files.forEach(function(file){
            rm(file)
          })
        })
      }

      var glob = td.function()
      var rm = td.function()
      td.when(glob('some/pattern/**')).thenCallback(null, ['foo', 'bar'])

      deleteFiles('some/pattern/**', glob, rm)

      td.verify(rm('foo'))
      td.verify(rm('bar'))
    });

    it('Callback APIs with a reversed callback argument', () => {
      function deleteFiles(pattern, glob, rm) {
        glob(function(er, files) {
          files.forEach(function(file){
            rm(file)
          })
        }, pattern);
      }

      var glob = td.function()
      var rm = td.function()
      td.when(glob(td.callback, 'some/pattern/**')).thenCallback(null, ['foo', 'bar'])

      deleteFiles('some/pattern/**', glob, rm)

      td.verify(rm('foo'))
      td.verify(rm('bar'))
    });

    it('Callback APIs with multiple callback arguments', () => {
      var doWork = td.function();
      td.when(doWork(td.callback(null, 42), td.callback(null, 58))).thenReturn();

      var percent = 0
      doWork(function(er, progress) {
        percent += progress
      }, function(er, progress) {
        percent += progress
      })

      expect(percent).to.equal(100);
    });

    it('Stub exceptions with thenThrow', () => {
      var save = td.function()
      td.when(save('bob')).thenThrow(new Error('Name taken'));
      expect(() => save('bob')).to.throw('Name taken');
    });

    it('Stub promises with thenResolve', () => {
      var fetch = td.function();
      td.when(fetch('/user')).thenResolve('Jane');

      return fetch('/user').then((value) => {
        expect(value).to.equal('Jane');
      });
    });

    it('Stub promises with thenReject', () => {
      var fetch = td.function()
      td.when(fetch('/user')).thenReject('Joe')

      return fetch('/user').catch((value) => {
        expect(value).to.equal('Joe');
      });
    });

    it('ignoreExtraArgs', () => {
      var logger = td.function();

      td.when(logger("Outcomes are:"), {ignoreExtraArgs: true}).thenReturn('loggy');

      expect(logger("Outcomes are:")).to.equal('loggy');
      expect(logger("Outcomes are:", "stuff")).to.equal('loggy');
      expect(logger("Outcomes are:", "stuff", "that", "keeps", "going")).to.equal('loggy');
      expect(logger("Outcomes are not:", "stuff")).to.be.undefined;
    });

    it('times', () => {
      var nextToken = td.function()

      td.when(nextToken(td.matchers.isA(Number))).thenReturn("foo")
      td.when(nextToken(3), {times: 2}).thenReturn("bar")

      expect(nextToken(3)).to.equal('bar');
      expect(nextToken(5)).to.equal('foo');
      expect(nextToken(3)).to.equal('bar');
      expect(nextToken(3)).to.equal('foo');
    });

  });

  describe('Verify', () => {
    it('basic verify throw error', () => {
      var quack = td.function('quack');

      quack('QUACK');

      expect(() => td.verify(quack())).to.throw(Error);
    });

    it('Arguments', () => {
      var enroll = td.function()

      enroll({name: 'Joe', age: 22, gender: null})

      td.verify(enroll({name: 'Joe', age: 22, gender: null})) // passes — deeply equal
    });

    it('relax verification', () => {
      var bark = td.function()

      bark('woof')

      td.verify(bark('woof')) // passes
      td.verify(bark(td.matchers.anything())) // passes

      var eatBiscuit = td.function()

      eatBiscuit(44)

      td.verify(eatBiscuit(44)) // passes
      td.verify(eatBiscuit(td.matchers.isA(Number))) // passes

    });

    it('captor', () => {
      function logInvalidComments(fetcher, logger) {
        fetcher('/comments', function(response){
          response.comments.forEach(function(comment) {
            if(!comment.valid) {
              logger('Hey, '+comment.text+' is invalid')
            }
          })
        })
      }

      var logger = td.function('logger'),
          fetcher = td.function('fetcher'),
          captor = td.matchers.captor();

      logInvalidComments(fetcher, logger);

      td.verify(fetcher('/comments', captor.capture()));

      //response that come from fetcher
      var response = {comments: [{valid: true}, {valid: false, text: 'PANTS'}]};
      captor.value(response);

      //test logger in callback
      td.verify(logger('Hey, PANTS is invalid'));
    });

    it('config verify', () => {
      var print = td.function();

      print('some', 'stuff', 'out', 'like', 8);

      td.verify(print(), {ignoreExtraArgs: true}) // passes
      td.verify(print('some'), {ignoreExtraArgs: true}) // passes
      td.verify(print('some', 'stuff'), {ignoreExtraArgs: true}) // passes


      var save = td.function()

      save('thing')
      save('thing')

      td.verify(save('thing')) // passes
      td.verify(save('thing'), {times: 2}) // throws - was called twice


      var doNotCall = td.function()

      td.verify(doNotCall(), {times: 0, ignoreExtraArgs: true}) // passes
    });
  });

})
