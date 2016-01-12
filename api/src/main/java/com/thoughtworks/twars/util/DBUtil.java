package com.thoughtworks.twars.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public final class DBUtil {

    private DBUtil() {}

    public static SqlSession getSession() {
        String resource = "mybatis/mybatis-config.xml";
        SqlSession session = null;

        try {
            InputStream is = Resources.getResourceAsStream(resource);
            SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
            SqlSessionFactory sqlSessionFactory = builder.build(is);

            session = sqlSessionFactory.openSession(true);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return session;
    }

}
