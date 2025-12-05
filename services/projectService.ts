
import { supabase } from './supabase';
import { aiService } from './aiService';
import { ProjectData } from '../types';

export const projectService = {
  // Generate data using Gemini AI, then save to Supabase associated with the User ID
  async createProject(idea: string, userId: string): Promise<ProjectData | null> {
    try {
      // 1. Generate real AI data
      const generatedData = await aiService.generateProjectData(idea);

      if (!generatedData) {
        throw new Error("Failed to generate project data from AI");
      }

      // 2. Save to Supabase with user_id
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            title: generatedData.title,
            data: generatedData,
            user_id: userId // Associate project with User
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving project to DB:', error);
        // Return generated data even if save fails (offline mode fallback)
        return generatedData;
      }

      // 3. Return combined data (DB ID + JSON Content)
      return {
        ...data.data,
        id: data.id
      };
    } catch (e) {
      console.error('Project Creation Error:', e);
      return null;
    }
  },

  // Update an existing project
  async updateProject(id: string, updates: Partial<ProjectData>) {
    // We update the 'data' column with the full object
    const { error } = await supabase
      .from('projects')
      .update({ data: updates })
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
      return false;
    }
    return true;
  },

  // Delete a project by ID
  async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }
    return true;
  },

  // Fetch list of projects for the current user
  async getUserProjects(userId: string): Promise<{ id: string; title: string; created_at: string }[] | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user projects:', error);
      return null;
    }
    return data;
  },

  // Fetch full project data by ID
  async getProjectById(id: string): Promise<ProjectData | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('data, id')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching project:', error);
      return null;
    }
    
    // Merge DB ID with the JSON data
    return { ...data.data, id: data.id };
  }
};
