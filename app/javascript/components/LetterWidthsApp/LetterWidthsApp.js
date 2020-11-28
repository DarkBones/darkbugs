import Letter from './Letter';
import React  from 'react';

export default function LetterWidthsApp() {
  const chars = "ABCEFGHIJKLMNOPQRSTOVWQRSTUVWabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+/*\\|{}[];:'\"<>?-".split('');
  
  return (
    <div>
      {chars.map((c, index) =>
        <Letter
          key={`${c}-${index}`}
          letter={c}
        />
      )}
      <Letter
        key={'dot'}
        letter="."
      />
      <Letter
        key={'space'}
        letter=". ."
      />
    </div>
  )
}