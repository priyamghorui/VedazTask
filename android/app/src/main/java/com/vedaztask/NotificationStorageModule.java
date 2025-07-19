package com.vedaztask;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONObject;
import org.json.JSONException;
import java.util.Map;

public class NotificationStorageModule extends ReactContextBaseJavaModule {
    private static final String TAG = "NotificationStorage";
    public NotificationStorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NotificationStorage";
    }

    @ReactMethod
    public void getAllNotifications(Promise promise) {
        try {
            SharedPreferences prefs = getReactApplicationContext()
                    .getSharedPreferences("notifications", Context.MODE_PRIVATE);

            Map<String, ?> all = prefs.getAll();
            JSONObject result = new JSONObject();

            for (Map.Entry<String, ?> entry : all.entrySet()) {
                result.put(entry.getKey(), entry.getValue());
            }

            promise.resolve(result.toString());
        } catch (Exception e) {
            promise.reject(">>>>>>_ERROR", e);
        }
    }


    @ReactMethod
    public void storeNotification(String title, String body) {
        // try {
            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences("notifications", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = prefs.edit();

        long timestamp = System.currentTimeMillis();
        JSONObject obj = new JSONObject();

        try {
            obj.put("title", title);
            obj.put("body", body);
            obj.put("timestamp", timestamp);
            editor.putString(String.valueOf(timestamp), obj.toString());
            editor.apply();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        Log.d(TAG, ">>>> " + timestamp);
    }
    @ReactMethod
    public void clearAllNotifications(Promise promise) {
        try {
            SharedPreferences prefs = getReactApplicationContext()
                    .getSharedPreferences("notifications", Context.MODE_PRIVATE);
            prefs.edit().clear().apply();
            promise.resolve("Cleared");
        } catch (Exception e) {
            promise.reject("CLEAR_NOTIFICATIONS_ERROR", e);
        }
    }

}
