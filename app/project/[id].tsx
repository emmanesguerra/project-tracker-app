// app/project/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProjectPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await db.getFirstAsync('SELECT * FROM projects WHERE id = ?', [id]);
        setProject(result);
      } catch (error) {
        console.error('Error loading project:', error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading project...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{project.name}</Text>
      <Text>Description: {project.description}</Text>
      <Text>Budget: ${project.budget}</Text>
      <Text>Created At: {project.created_at}</Text>
      <Text>Updated At: {project.updated_at}</Text>
    </SafeAreaView>
  );
}
