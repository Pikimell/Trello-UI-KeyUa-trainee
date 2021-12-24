import axios from "axios";
import {PATH} from "../consts";

const columnIndexModule = {
    state:{
        colIndexes: []
    },
    mutations:{
        loadColumnIndexes: (state, colIndex) => {
            state.colIndexes = colIndex;
        },
        indexingColumns: (state, columns) => {
            let listIndex = [];
            columns.forEach(x=>listIndex.push(x.idColumn))
            state.colIndexes = listIndex
            axios.put(PATH + `/updateIndexes/columns`,{
                colIndexes: JSON.stringify({
                    columns: listIndex
                })
            }).catch(function (error) {
                console.log(error);
            });
        },
        pushIndex: (state, idColumn) => {
            state.colIndexes.push(idColumn)
        },
        delIndexes: (state, idColumn) => {
            state.colIndexes = state.colIndexes.filter(x=> x !== idColumn)
        },
        refreshInDB: (state) => {
            axios.put(PATH + `/updateIndexes/columns`,{
                colIndexes: JSON.stringify({
                    columns: state.colIndexes
                })
            }).catch(function (error) {
                console.log(error);
            });
        }
    },
    actions:{
        loadColumnIndexes: ({commit}) => {
            axios.get(PATH + '/getColIndexes')
                .then(function (response) {
                    commit('loadColumnIndexes', JSON.parse(response.data.Items[0].colIndexes).columns)
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        indexingColumns: ({commit}, data) => {
            commit('indexingColumns',data)
        },
        pushIndex: ({commit}, idColumn) => {
            commit('pushIndex',idColumn)
            commit('refreshInDB',idColumn)
        },
        delIndexes: ({commit},idColumn) => {
            commit('delIndexes',idColumn)
            commit('refreshInDB',idColumn)
        }
    },
    getters:{
        INDEX_COL(state){
            return state.colIndexes;
        }
    }
}

export {
    columnIndexModule
}
