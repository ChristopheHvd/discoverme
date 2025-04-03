import { ProfileService, Profile } from '../../services/dataService.js';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(() => {
    // Cru00e9er une nouvelle instance du service pour chaque test
    profileService = new ProfileService();
  });

  describe('getProfile', () => {
    it('should return the default profile when no profileId is provided', () => {
      const profile = profileService.getProfile();
      expect(profile).not.toBeNull();
      expect(profile?.name).toBe('John Doe');
      expect(profile?.title).toBe('Du00e9veloppeur Full Stack');
    });

    it('should return null for a non-existent profile', () => {
      const profile = profileService.getProfile('non-existent');
      expect(profile).toBeNull();
    });
  });

  describe('getProfileSection', () => {
    it('should return the skills section of the default profile', () => {
      const skills = profileService.getProfileSection('skills');
      expect(Array.isArray(skills)).toBe(true);
      expect(skills).toContain('JavaScript');
      expect(skills).toContain('TypeScript');
    });

    it('should return the experience section of the default profile', () => {
      const experience = profileService.getProfileSection('experience');
      expect(Array.isArray(experience)).toBe(true);
      expect(experience.length).toBeGreaterThan(0);
      expect(experience[0].company).toBe('Tech Company');
    });

    it('should return null for a non-existent profile', () => {
      const section = profileService.getProfileSection('skills', 'non-existent');
      expect(section).toBeNull();
    });
  });

  describe('checkAvailability', () => {
    it('should return available=true for a weekday during business hours', () => {
      // Le 3 avril 2025 est un jeudi (jour 4 de la semaine, 0 = dimanche, 4 = jeudi)
      const result = profileService.checkAvailability('2025-04-03', '14:00');
      expect(result.available).toBe(true);
      expect(result.message).toContain('est disponible');
    });

    it('should return available=false for a weekend', () => {
      // Le 5 avril 2025 est un samedi (jour 6 de la semaine)
      const result = profileService.checkAvailability('2025-04-05', '14:00');
      expect(result.available).toBe(false);
      expect(result.message).toContain('n\'est pas disponible');
    });

    it('should return available=false for outside business hours', () => {
      // Heure en dehors des heures de travail (avant 9h)
      const result = profileService.checkAvailability('2025-04-03', '08:00');
      expect(result.available).toBe(false);
      expect(result.message).toContain('n\'est pas disponible');
    });
  });

  describe('requestContact', () => {
    it('should return a success message for a valid contact request', () => {
      const result = profileService.requestContact('Discussion professionnelle', 'email');
      expect(result.success).toBe(true);
      expect(result.message).toContain('a u00e9tu00e9 enregistru00e9e');
      expect(result.message).toContain('email');
      expect(result.message).toContain('Discussion professionnelle');
    });

    it('should return a failure message for a non-existent profile', () => {
      const result = profileService.requestContact('Discussion professionnelle', 'email', 'non-existent');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Profil non trouvu00e9');
    });
  });
});
