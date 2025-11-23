import React from 'react';
import { Check, X } from 'lucide-react';
import { Player } from './Player';
import { CharacterId } from '../types';
import { Button } from './Button';

interface CharacterSelectorProps {
  currentSkin: CharacterId;
  onSelect: (skin: CharacterId) => void;
  onClose: () => void;
}

const CHARACTERS: { id: CharacterId; name: string }[] = [
  { id: 'boy', name: '淘气包' },
  { id: 'girl', name: '小甜心' },
  { id: 'cat', name: '招财猫' },
  { id: 'dog', name: '旺财' },
  { id: 'robot', name: '存钱罐' },
  { id: 'alien', name: '外星人' },
];

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ currentSkin, onSelect, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="bg-sky-500 p-4 text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold">选择你的角色</h2>
          <button onClick={onClose} className="p-1 hover:bg-sky-600 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelect(char.id)}
              className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all group
                ${currentSkin === char.id 
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200 ring-offset-2' 
                  : 'border-gray-100 hover:border-sky-300 hover:bg-sky-50'}
              `}
            >
              <div className="w-20 h-20 transform group-hover:scale-110 transition-transform duration-200">
                 <Player skin={char.id} />
              </div>
              <span className="font-bold text-gray-700 mt-2">{char.name}</span>
              
              {currentSkin === char.id && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-md">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-100 shrink-0">
           <Button onClick={onClose} className="w-full md:w-auto min-w-[120px]">
             确认
           </Button>
        </div>
      </div>
    </div>
  );
};