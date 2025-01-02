import { Text, View, TextInput, StyleSheet, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";



import {Inter_500Medium, useFonts} from "@expo-google-fonts/inter";

import { data } from "@/data/todos"

export default function Index() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const router = useRouter()

  const [loaded, error] = useFonts({
    Inter_500Medium, 
  })

  useEffect(() => {
    const fetchData = async () =>{
      try{
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null
        if (storageTodos && storageTodos.length){
          setTodos(storageTodos.sort((a,b) => b.id - a.id))
        }
        else{
          setTodos(data.sort((a,b) => b.id-a.id))
        }
      } 
      catch(e){
        console.error(e)

      }
    }
    fetchData()
  }, [data])
  
  useEffect(() =>{
      const storeData = async() =>{
        try{
          const jsonValue = JSON.stringify(todos)
          await AsyncStorage.setItem("TodoApp",jsonValue)
        }
        catch(e){
          console.error(e)
        }
      }
      storeData()
  }, [todos])

  if(!loaded && !error){
    return null
  }
  const addTodo = () => {
    if (text.trim()){
      const newId = todos.length > 0 ? todos[0].id +1 : 1;
      setTodos([{id: newId, title: text, completed: false}, ...todos])
      setText('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ))
  }

  const removeTodos = (id) => {
    setTodos(todos.filter(todo => todo.id != id))
  }

  const handlePress = (id) => {
    router.push(`/todos/${id}`)
  }

  const renderItem = ({item}) => (
    <View style={styles.todoItem}>
      <Pressable
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleTodo(item.id)}
      >
        <Text
          style={[styles.todoText, item.completed && styles.completedText]}
          >{item.title}
          </Text>
        </Pressable>
      <Pressable onPress={() => removeTodos(item.id)}>
      <MaterialCommunityIcons name="delete-circle" size={34} color="#8B0000" />
      </Pressable>
    </View>
  )
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="black"
          value={text}
          onChangeText={setText}/>
          <Pressable onPress={addTodo} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{flexGrow: 1}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    width: '100%',
    maxWidth: 1024,
    marginalHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  input: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    borderRadiuus: 5,
    padding: 10,
    marginRight: 10,
    fontSize:17,
    fontFamily: 'Inter_500Medium',
    minWidth: 0,
    color: 'white',
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  addButtonText: {
    fonstSize:18,
    color: 'black',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    padding: 10,
    borderBottomColow: 'gray',
    borderBottomWidth: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  todoText: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Inter_500Medium',
    color: 'white',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'black',
  }
})
