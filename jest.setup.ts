import "@testing-library/jest-dom";

// Workaround for JSDOM bug: see https://github.com/jsdom/jsdom/issues/3002
Range.prototype.getClientRects = () => ({
  item: () => null,
  length: 0,
  [Symbol.iterator]: jest.fn(),
});

// Workaround for another JSDOM deficiency: see https://stackoverflow.com/questions/68679993/referenceerror-resizeobserver-is-not-defined
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
