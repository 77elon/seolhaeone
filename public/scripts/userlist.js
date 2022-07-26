

const dataSource = {
    contentType: 'application/json',
    api: {
        readData: {
            url: () => '/admin/api/user/readData',
            method: 'GET'
        },
        updateData: {
            url: () => '/admin/api/user/updateData',
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
    minBodyHeight: 70,
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
            header: '사용자 이름',
            name: 'userName',
            editor: 'text',
            align: 'center',
            sortable: true
        },
        {
            header: '접속 비밀번호',
            name: 'userPassword',
            editor: 'text',
            align: 'center',
            sortable: true
        },
        {
            header: '만료 날짜',
            name: 'ExpireDate',
            editor: {
                type: 'datePicker',
                options: {
                    format: 'yyyy-MM-dd'
                }
            },
            align: 'center',
            sortable: true
        }
    ]
});

function appendrow() {
    var rowData = [{userName: "", userPassword: "", ExpireDate: ""}]
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


$('#append').on('click', appendrow);
$('#modify').on('click', syncServer);
$('#delete').on('click', deleterow);
