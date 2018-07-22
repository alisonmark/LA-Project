var users = {
    id: 55460299,
    name: 'Quan LV',
    login: 'quanlv1',
    pass: 'china2902'
};

// QB.createSession({ login: user.login, password: user.pass }, function(err, res) {
//     if (res) {
//         QB.chat.connect({ userId: user.id, password: user.pass }, function(err, roster) {
//             if (err) {
//                 console.log(err);
//             } else {

//                 /*
//                  *  (Object) roster - The user contact list
//                  *  roster = {
//                  *    '1126541': {subscription: 'both', ask: null},        // you and user with ID 1126541 subscribed to each other.
//                  *    '1126542': {subscription: 'none', ask: null},        // you don't have subscription but user maybe has
//                  *    '1126543': {subscription: 'none', ask: 'subscribe'}, // you haven't had subscription earlier but now you asked for it
//                  *  }; 
//                  */

//             }
//         });
//     } else {
//         console.log(err);
//     }
// });

var usersForDialogCreationStats = {
    currentPage: 0,
    retrievedCount: 0,
    totalEntries: null
}

var usersForDialogUpdateStats = {
    currentPage: 0,
    retrievedCount: 0,
    totalEntries: null
}

function retrieveUsersForDialogCreation(callback) {
    retrieveUsers(usersForDialogCreationStats, callback);
}

function retrieveUsersForDialogUpdate(callback) {
    retrieveUsers(usersForDialogUpdateStats, callback);
}

function retrieveUsers(usersStorage, callback) {

    // we got all users
    if (usersStorage.totalEntries != null && usersStorage.retrievedCount >= usersStorage.totalEntries) {
        callback(null);
        return;
    }

    $("#load-users").show(0);
    usersStorage.currentPage = usersStorage.currentPage + 1;

    // Load users, 10 per request
    //
    QB.users.listUsers({ page: usersStorage.currentPage, per_page: '10' }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);

            mergeUsers(result.items);

            callback(result.items);

            $("#load-users").delay(100).fadeOut(500);

            usersStorage.totalEntries = result.total_entries;
            usersStorage.retrievedCount = usersStorage.retrievedCount + result.items.length;
        }
    });
}

function updateDialogsUsersStorage(usersIds, callback) {
    var params = { filter: { field: 'id', param: 'in', value: usersIds }, per_page: 100 };

    QB.users.listUsers(params, function(err, result) {
        if (result) {
            mergeUsers(result.items);
        }

        callback();
    });
}

function mergeUsers(usersItems) {
    var newUsers = {};
    usersItems.forEach(function(item, i, arr) {
        newUsers[item.user.id] = item.user;
    });
    users = $.extend(users, newUsers);
}

function getUserLoginById(byId) {
    var userLogin;
    if (users[byId]) {
        userLogin = users[byId].login;
        return userLogin;
    }
}