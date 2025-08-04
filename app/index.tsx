import CreateProjectModal from '@/src/components/modal/CreateProjectModal';
import { addProject, useProjects } from '@/src/database/project';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage() {
  const { projects, refreshProjects, db } = useProjects();
  const [modalVisible, setModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await addProject(db, newProjectName.trim());
      await refreshProjects();
      setNewProjectName('');
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Projects</Text>

        <Pressable
          style={{
            backgroundColor: '#007bff',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>+ Create New Project</Text>
        </Pressable>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: '/project/[id]', params: { id: item.id.toString() } }}
            asChild
          >
            <Pressable style={{ marginBottom: 12, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
              <Text>{item.id}</Text>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>{item.budget}</Text>
              <Text>{item.created_at}</Text>
              <Text>{item.updated_at}</Text>
            </Pressable>
          </Link>
        )}
      />

      <CreateProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCreateProject}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
      />
    </SafeAreaView>
  );
}
