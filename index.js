// index.js

import 'react-native-get-random-values';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

import process from 'process';
global.process = process || { env: {} };

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);