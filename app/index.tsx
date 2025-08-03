import { addProject, useProjects } from '@/src/database/project';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
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

      {/* Header Row */}
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

      {/* List of Projects */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/project/[id]", params: { id: item.id.toString() } }} asChild>
            <Pressable style={{ marginBottom: 12, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
              <Text>{item.id}</Text>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>{item.budget}</Text>
              <Text>{item.created_at}</Text>
              <Text>{item.updated_at}</Text>
            </Pressable>
          </Link>
        )
        }
      />

      {/* Modal for new project */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>New Project Name</Text>
            <TextInput
              placeholder="Enter project name"
              value={newProjectName}
              onChangeText={setNewProjectName}
              style={{
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 8,
                borderRadius: 6,
                marginBottom: 12,
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ marginRight: 10, paddingVertical: 6, paddingHorizontal: 12 }}
              >
                <Text style={{ color: 'gray' }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleCreateProject}
                style={{ backgroundColor: '#007bff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 }}
              >
                <Text style={{ color: '#fff' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
}
