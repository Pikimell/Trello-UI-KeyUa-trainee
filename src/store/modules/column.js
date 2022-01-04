import axios from "axios";
import {PATH} from "../consts";

const columnModule = {
    state: {
        cols: []
    },
    mutations: {
        loadColumns: (state, columns) => {
            state.cols = columns;
        },
        pushColumn: (state, column) => {
            state.cols.push(column);
        },
        delColumn: (state, idColumn) => {
            state.cols = state.cols.filter(x => x.idColumn !== idColumn)
        },
        editTitleCol: (state, {idColumn, title}) => {
            for (let i = 0; i < state.cols.length; i++) {
                if (state.cols[i].idColumn === idColumn) {
                    state.cols[i].title = title;
                    break;
                }
            }
        },
        sortListColumn: (state, index) => {
            let sortList = [];
            let listCol = state.cols;
            index.forEach(idCol => {
                let col = listCol.filter(col => col.idColumn === idCol)[0]
                sortList.push(col)
            })
            state.cols = sortList
        }
    },
    actions: {
        loadColumns: async ({commit}) => {
            let token = localStorage.getItem('userIdToken')
            axios.get(PATH + '/getColumns',{headers: {"Authorization": `Bearer ${token}`}})
                .then(function (response) {
                    let cols = response.data.Items;
                    axios.get(PATH + '/getColIndexes',{headers: {"Authorization": `Bearer ${token}`}})
                        .then(function (response) {
                            let colIndex = JSON.parse(response.data.Items.filter(x => x.idIndex === "columns")[0].colIndexes).columns
                            commit('loadColumns', cols)
                            commit('loadColumnIndexes', colIndex)
                            commit('sortListColumn', colIndex)
                        })
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        pushColumn: async ({commit}, column) => {
            let token = localStorage.getItem('userIdToken')
            axios.post(PATH + '/pushColumn', {
                idColumn: column.idColumn,
                title: column.title
            },{headers: {"Authorization": `Bearer ${token}`}})
                .then(()=>{
                    commit('pushColumn', column);
            }).catch(function (error) {
                console.log(error);
            });
        },
        delColumn: async ({commit}, idColumn) => {
            let token = localStorage.getItem('userIdToken')
            axios.delete(PATH + `/deleteColumn/${idColumn}`,{headers: {"Authorization": `Bearer ${token}`}})
                .then(()=>{
                        commit('delColumn', idColumn)
                }).catch(function (error) {
                console.log(error);
            });
        },
        editTitleCol: ({commit}, props) => {
            let token = localStorage.getItem('userIdToken')
            axios.put(PATH + `/updateColumn/${props.idColumn}`, {
                title: props.title,
            },{headers: {"Authorization": `Bearer ${token}`}})
                .then(()=>{
                    commit('editTitleCol', props)
            }).catch(function (error) {
                console.log(error);
            });
        },
        sortListColumn: ({commit}, index) => {
            commit('sortListColumn', index)
        }
    },
    getters: {
        COLUMNS(state) {
            return state.cols
        }
    }
}

export {
    columnModule
}