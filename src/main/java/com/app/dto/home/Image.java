package com.app.dto.home;

import lombok.Data;

@Data
public class Image {
	int imageId;
	String imageUrl;
	String isThumbnail;
	int orderIndex;
}