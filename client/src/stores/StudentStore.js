import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mande } from 'mande' //Mande lets us fetch the API

const studentAPI = mande('api/students') // Links API to be used

//StudentStore stores all of our functions, computed properties and variables to be used across all of our programs
export const useStudentStore = defineStore('students', () => {

    const sortedStudents = ref([ ])

    const mostRecentStudent = ref( {} )  //empty object

    const addNewStudentErrors = ref([])

    function getAllStudents() {
        // make an API request to get all students and save in store - studentList
        studentAPI.get().then( students => {
         sortedStudents.value = students
        }).catch( err => {
            console.log(err)
        })
    }


    function addNewStudent(student) {  //adds new student to the list
        // make api call to add new student
        // call getAllStudents to re-request list of students from API server
        studentAPI.post(student).then( () => {
            getAllStudents()
        }).catch( err => {
            addNewStudentErrors.value = err.body //If theres an issue, adds it to an array and is displayed for user
        })
    }

    function deleteStudent(studentToDelete) {  //deletes students from list when button is pressed
        // makes API call to delete student
        // call getAllStudents to re-request list from API server
         const deleteStudentAPI = mande(`/api/students/${studentToDelete.id}`)
         deleteStudentAPI.delete().then( () => {
            mostRecentStudent.value = {}
            getAllStudents()
         }).catch( err => {
            console.log(err)
        })
    }

    function arrivedOrLeft(student) {
        const editStudentAPI = mande(`/api/students/${student.id}`)
        editStudentAPI.patch(student).then( () => { //sends patch request to change student arrived boolean value
            mostRecentStudent.value = student
            getAllStudents()
        }).catch( err => {
            console.log(err)
        })
    }

    const studentCount = computed( () => { //keeps track of number of students in list
        return sortedStudents.value.length
    })

    // const sortedStudents = computed( () => {  //sorts students alphabetically in our list
    //     return studentList.value.toSorted( (s1, s2) => {
    //         return s1.name.localeCompare(s2.name)
    //     })
    //})

    return {
        mostRecentStudent,
        addNewStudent,
        deleteStudent,
        arrivedOrLeft,
        studentCount,
        sortedStudents,
        getAllStudents,
        addNewStudentErrors
    }


})