
import { ScoreEntry, CharacterId } from '../types';
import { GAME_CONSTANTS } from '../constants';
import { supabase } from './supabaseClient';

/**
 * Data Manager (Supabase Version)
 * Strategies:
 * 1. Try Supabase first.
 * 2. If Supabase fails, fallback to LocalStorage.
 */

export const dataManager = {
  
  async getLeaderboard(): Promise<ScoreEntry[]> {
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      if (data) {
        return data.map((d: any) => ({
          id: d.id.toString(),
          name: d.name,
          score: d.score,
          date: d.created_at
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage', e);
    }

    // Fallback: LocalStorage
    const saved = localStorage.getItem(GAME_CONSTANTS.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score);
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  async saveScore(name: string, score: number): Promise<void> {
    const entry: ScoreEntry = {
      id: Date.now().toString(),
      name,
      score,
      date: new Date().toISOString()
    };

    // 1. Always save to LocalStorage as backup/cache immediately for UI responsiveness
    const localData = await this.getLeaderboardFallback();
    localData.push(entry);
    localData.sort((a, b) => b.score - a.score);
    localStorage.setItem(GAME_CONSTANTS.STORAGE_KEY, JSON.stringify(localData.slice(0, 50)));

    // 2. Try Supabase
    try {
      const { error } = await supabase
        .from('game_scores')
        .insert([{ name, score }]);
      
      if (error) throw error;
    } catch (e) {
      console.warn('Supabase save failed, saved locally only.', e);
    }
  },

  async getSkinPreference(playerName: string): Promise<CharacterId | null> {
    if (playerName) {
      try {
        const { data, error } = await supabase
          .from('player_preferences')
          .select('selected_skin')
          .eq('player_name', playerName)
          .single();
        
        if (!error && data) {
          return data.selected_skin as CharacterId;
        }
      } catch (e) {
        // ignore error
      }
    }

    // Local check
    const saved = localStorage.getItem('falling_money_skin');
    return saved as CharacterId | null;
  },

  async saveSkinPreference(playerName: string, skin: CharacterId): Promise<void> {
    // Local
    localStorage.setItem('falling_money_skin', skin);

    // Supabase
    if (playerName) {
      try {
        const { error } = await supabase
          .from('player_preferences')
          .upsert({ player_name: playerName, selected_skin: skin }, { onConflict: 'player_name' });
          
        if (error) throw error;
      } catch (e) {
        // ignore
        console.warn('Failed to sync skin preference', e);
      }
    }
  },

  // Internal helper for direct local access
  getLeaderboardFallback(): ScoreEntry[] {
    const saved = localStorage.getItem(GAME_CONSTANTS.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { return []; }
    }
    return [];
  }
};
