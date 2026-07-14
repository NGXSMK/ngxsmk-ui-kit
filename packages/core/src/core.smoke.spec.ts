import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkAnimate, playEnter } from '@ngxsmk/core/animation';

describe('@ngxsmk/core public API', () => {
  it('exposes components and animation helpers', () => {
    expect(NgxsmkButton).toBeDefined();
    expect(NgxsmkAnimate).toBeDefined();
    expect(playEnter).toBeDefined();
  });
});
