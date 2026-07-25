import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the portfolio and its primary sections', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Laçin Temel/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /^Deneyim$/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /^Projelerim/i })).toBeInTheDocument();
});

test('opens portfolio details when interactive lab modes are clicked', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /MODA Analizi|MODA Analysis/i }));
  expect(within(screen.getByRole('dialog')).getByText('sample.docm')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Detayları kapat|Close details/i }));

  fireEvent.click(screen.getByRole('button', { name: /Proje Ağı|Project Network/i }));
  expect(screen.getByRole('dialog')).toHaveTextContent('PayMaki');
  fireEvent.click(screen.getByRole('button', { name: /Detayları kapat|Close details/i }));

  fireEvent.click(screen.getByRole('button', { name: /Kariyer Yolculuğu|Career Journey/i }));
  expect(screen.getByRole('dialog')).toHaveTextContent('Türkiye İş Bankası');
});
