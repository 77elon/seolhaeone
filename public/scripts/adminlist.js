
const dataSource = {
    contentType: 'application/json',
    api: {
        readData: {
            url: () => '/admin/api/admin/readData',
            method: 'GET'
        },
        updateData: {
            url: () => '/admin/api/admin/updateData',
            method: 'PUT'
        }
    },
    hideLoadingBar: true
};


const grid = new tui.Grid({
    el: document.getElementById('grid'),
    data: dataSource,
    scrollX: false,
    scrollY: false,
    minBodyHeight: 50,
    editingEvent: 'click',
    rowHeaders: [
        {
            type: 'checkbox',
            title: 'select all'
        }
    ],
    align: 'center',
    columns: [
        {
            header: '관리자 이름',
            name: 'adminName',
            editor: 'text',
            align: 'center',
            sortable: true
        },
        {
            header: '관리자 ID',
            name: 'adminID',
            editor: 'text',
            align: 'center',
            sortable: true
        },
        {
            header: '접속 비밀번호',
            name: 'adminPassword',
            editor: 'text',
            align: 'center',
            sortable: true
        }
    ]
});

function appendrow() {
    var rowData = [{userName: "", userID: "", userPassword: ""}]
    let focus = grid.getFocusedCell();
    //grid.check(focus.rowKey);
    const index = grid.getIndexOfRow(focus.rowKey);
    grid.appendRow(rowData, {
        at: index + 1,
        focus: true
    });
    grid.enable();
    
}


function deleterow() {
    grid.removeCheckedRows(true);
}

function syncServer() {
    grid.blur();
    const { rowKey, columnName } = grid.getFocusedCell();
    
    if (rowKey && columnName) {
        grid.finishEditing(rowKey, columnName);
    }
    
    grid.request('updateData', {
        checkedOnly: false,
        modifiedOnly: false
    });
    
}

grid.on('response', ev => {
    const {response} = ev.xhr;
    const responseObj = JSON.parse(response);
    
    console.log('result : ', responseObj.result);
    console.log('data : ', responseObj.data);
});

$('#append').on('click', appendrow);
$('#modify').on('click', syncServer);
$('#delete').on('click', deleterow);
