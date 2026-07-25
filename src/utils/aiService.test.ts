import { formatMessage, getAIResponse, resetConversation } from './aiService';

beforeEach(() => {
  resetConversation();
});

test('does not confuse common English words with a greeting', () => {
  const response = getAIResponse('What is his work experience?', 'en');

  expect(response.text).toContain('Work Experience');
  expect(response.text).toContain('Türkiye İş Bankası');
});

test('routes MODA questions to the dedicated project answer', () => {
  const response = getAIResponse('MODA projesi ne yapıyor?', 'tr');

  expect(response.text).toContain('Malicious Office Document Analyzer');
  expect(response.text).toContain('YARA');
  expect(response.text).toContain('github.com/lacintemel/Masterclass');
});

test('a detailed question starting with peki is not mistaken for a generic follow-up', () => {
  getAIResponse('Projeleri neler?', 'tr');
  const response = getAIResponse('Peki deneyimleri neler?', 'tr');

  expect(response.text).toContain('İş Deneyimi');
  expect(response.text).toContain('Information Security Intern');
});

test('escapes user-provided HTML before rendering chat markup', () => {
  const formatted = formatMessage('<img src=x onerror=alert(1)> **test**');

  expect(formatted).not.toContain('<img');
  expect(formatted).toContain('&lt;img');
  expect(formatted).toContain('<strong>test</strong>');
});
