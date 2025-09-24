import '@testing-library/jest-dom';

// Polyfill para TextEncoder en Node
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
