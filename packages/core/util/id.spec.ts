import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ngxsmkUniqueId, resetNgxsmkUniqueId, NgxsmkIdGenerator } from './id';

describe('ngxsmkUniqueId & NgxsmkIdGenerator', () => {
  beforeEach(() => {
    resetNgxsmkUniqueId(0);
  });

  it('generates sequential unique IDs with prefix', () => {
    expect(ngxsmkUniqueId('test')).toBe('test-0');
    expect(ngxsmkUniqueId('test')).toBe('test-1');
    expect(ngxsmkUniqueId('input')).toBe('input-2');
  });

  it('resets counter deterministically for SSR boundaries', () => {
    expect(ngxsmkUniqueId('btn')).toBe('btn-0');
    expect(ngxsmkUniqueId('btn')).toBe('btn-1');
    resetNgxsmkUniqueId(0);
    expect(ngxsmkUniqueId('btn')).toBe('btn-0');
  });

  it('provides scoped DI-based NgxsmkIdGenerator service', () => {
    const generator = TestBed.inject(NgxsmkIdGenerator);
    generator.reset(10);
    expect(generator.nextId('item')).toBe('item-10');
    expect(generator.nextId('item')).toBe('item-11');
  });
});
