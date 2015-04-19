require.config({
    baseUrl: '<%= baseUrl %>',
    packages: [<% _.forEach(packages, function (package, index) { %>
        {
            name: '<%- package.name %>',
            location: '<%- package.location %>',
            main: '<%- package.main %>'
        }<%= index !== lastIndex ? ',' : '' %><% }) %>
    ]
});
