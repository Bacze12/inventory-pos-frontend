import { helloWorld } from './HelloWorld';

test('hello world!', () => {
	expect(helloWorld()).toBe('Hello, World!');
});
