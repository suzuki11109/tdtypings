declare namespace TestDouble {
  interface TestDoubleStatic {
    function: TestDoubleFunctionStatic;
    when: TestDoubleWhenStatic;
    explain(testDouble: TestDoubleFunction): TestDoubleDescriptionObject;
    object: TestDoubleObjectStatic;
    verify: TestDoubleVerifyStatic;
    callback(...params: any[]): any;

    matchers: TestDoubleMatchers;
  }

  interface TestDoubleVerifyStatic {
    (fn: any): any;
    (fn: any, config: any): any;
  }

  interface TestDoubleMatchers {
    anything(): any;
    isA(someType: any): any;
    contains(...matchingValues: any[]): any;
    contains(matchingObjects: any): any;
    argThat(fn: Function): any;
    not(notPassedValue: any): any;
    captor(): TestDoubleCaptor;
  }

  interface TestDoubleCaptor {
    capture(): any;
    value(any): any;
  }

  interface TestDoubleFunctionStatic {
    (): TestDoubleFunction;
    (name: any): TestDoubleFunction;
  }

  interface TestDoubleWhenStatic {
    (fn: any): TestDoubleStub;
    (fn: any, config: any): TestDoubleStub;
  }

  interface TestDoubleObjectStatic {
    (functionNames: string[]): any;
    <T>(constructorFunction: { new(): T; }): T;
    <U>(objectWithFunctions: U): U;
  }

  interface TestDoubleFunction {
    (...params: any[]): any;
  }

  interface TestDoubleStub {
    thenReturn(...stubbedValues: any[]): TestDoubleFunction;
    thenCallback(...stubbedValues: any[]): TestDoubleFunction;
    thenDo(...stubbedValues: any[]): TestDoubleFunction;
    thenThrow(...stubbedValues: any[]): TestDoubleFunction;
    thenResolve(...stubbedValues: any[]): TestDoubleFunction;
    thenDo(...stubbedValues: any[]): TestDoubleFunction;
    thenReject(...stubbedValues: any[]): TestDoubleFunction;
  }

  interface TestDoubleDescriptionObject {
    callCount: number;
    calls: any[];
    description: string;
    isTestDouble: boolean;
  }
}

declare var testdouble: TestDouble.TestDoubleStatic;

declare module "testdouble" {
  export = testdouble;
}
