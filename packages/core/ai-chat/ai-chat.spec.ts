import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkAiChat, NgxsmkAiMessage } from './ai-chat';

@Component({
  standalone: true,
  imports: [NgxsmkAiChat],
  template: `
    <ngxsmk-ai-chat
      [messages]="messages()"
      [suggestions]="suggestions()"
      (sendMessage)="sentMessage.set($event)"
    />
  `,
})
class HostComponent {
  readonly messages = signal<NgxsmkAiMessage[]>([]);
  readonly suggestions = signal<string[]>(['Help', 'Examples']);
  readonly sentMessage = signal<string>('');
}

describe('NgxsmkAiChat', () => {
  it('renders suggestions when no messages exist', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const suggestions = fixture.nativeElement.querySelectorAll('.ngxsmk-ai-chat__suggestion-btn');
    expect(suggestions.length).toBe(2);
    expect(suggestions[0].textContent.trim()).toBe('Help');
  });

  it('triggers send message when suggestion chip is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const sugBtn = fixture.nativeElement.querySelector('.ngxsmk-ai-chat__suggestion-btn') as HTMLButtonElement;
    sugBtn.click();
    fixture.detectChanges();

    const host = fixture.componentInstance;
    expect(host.sentMessage()).toBe('Help');
  });
});
