package com.vedaztask;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.content.SharedPreferences;

import androidx.core.app.NotificationCompat;

import com.vedaztask.MainActivity;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "FCM_SERVICE";
    private static final String CHANNEL_ID = "default_channel_id";

@Override
public void onMessageReceived(RemoteMessage remoteMessage) {
    Log.d(TAG, "starting............");
    try {
        String title = null;
        String body = null;

        if (remoteMessage.getNotification() != null) {
            title = remoteMessage.getNotification().getTitle();
            body = remoteMessage.getNotification().getBody();
        }

        Map<String, String> data = remoteMessage.getData();
        if ((title == null || body == null) && data != null && !data.isEmpty()) {
            if (title == null) title = data.get("title");
            if (body == null) body = data.get("body");
        }

        if (title == null) title = "New Message";
        if (body == null) body = "You have a new notification";

        
        Log.d(TAG, "beforenoti.....");
        showNotification(title, body);
        storeNotification(title, body);
    } catch (Exception e) {
        Log.e("FCM", "error >>>: ", e);
    }
}


    private void storeNotification(String title, String body) {
        SharedPreferences prefs = getSharedPreferences("notifications", MODE_PRIVATE);
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

        Log.d(TAG, ">> stored at: " + timestamp);
    }

    private void showNotification(String title, String body) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE
        );

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher) 
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(soundUri)
            .setContentIntent(pendingIntent);

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Default Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            );
            manager.createNotificationChannel(channel);
        }

        manager.notify((int) System.currentTimeMillis(), builder.build());
    }

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        Log.d(TAG, ">>>> Token: " + token);
     
    }
}
