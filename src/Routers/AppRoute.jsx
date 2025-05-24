import React from 'react'
import { Route, Routes } from 'react-router-dom'
// import TopicSelectionForm from '../Pages/Assessments/TopicSelections'
import TopicAssessmentForm from '../Pages/Assessments/TopicSelections'
import Assessment from '../Pages/Assessments/Assessment'
import AssessmentResult from '../Pages/Assessments/AssessmentResult'
import ViewHistory from '../Pages/Assessments/ViewHistory'

const AppRoute = () => {
  return (
    <Routes>
        <Route path='/' element={<TopicAssessmentForm/>}/>
        <Route path='/assessment' element={<Assessment/>}/>
        <Route path='/assessment-result' element={<AssessmentResult/>}/>
        <Route path='/assessment-history' element={<ViewHistory/>}/>
    </Routes>
  )
}

export default AppRoute