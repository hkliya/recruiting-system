package com.thoughtworks.twars.bean;

public class PasswordRetrieveDetail {
    private int id;
    private String email;
    private String token;
    private int retrieveData;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getRetrieveData() {
        return retrieveData;
    }

    public void setRetrieveData(int retrieveData) {
        this.retrieveData = retrieveData;
    }
}
