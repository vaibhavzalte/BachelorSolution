package com.uv.app.transformer;

import com.uv.generated.app.model.FoodStallRequest;
import com.uv.generated.app.model.MessRequest;
import com.uv.generated.app.model.RoomRequest;
import com.uv.generated.app.model.RoomVacancyRequest;
import com.uv.generated.app.model.StudyRoomRequest;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public abstract class BaseTransformer<REQ, PAYLOAD, RES> implements DataTransformer<REQ, PAYLOAD, RES> {
    protected REQ listing;

    protected BaseTransformer(REQ listing) {
        this.listing = listing;
    }

    @Override
    public String getPrimaryId() {
        return CommonRequestReader.getPrimaryId(listing);
    }

    @Override
    public String getCity() {
        return CommonRequestReader.getCity(listing);
    }

    @Override
    public String getSubType() {
        return CommonRequestReader.getSubType(listing);
    }

    @Override
    public Double getLatitude() {
        return CommonRequestReader.getLatitude(listing);
    }

    @Override
    public Double getLongitude() {
        return CommonRequestReader.getLongitude(listing);
    }

    @Override
    public void setImages(List<String> images) {
        CommonRequestReader.setImages(listing, images);
    }

    @Override
    public REQ getRequest() {
        return listing;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        return Collections.emptyMap();
    }

    static final class CommonRequestReader {
        private CommonRequestReader() {
        }

        static String getPrimaryId(Object listing) {
            if (listing == null) {
                return null;
            }
            return switch (listing) {
                case RoomRequest roomRequest -> roomRequest.getPrimaryId();
                case MessRequest messRequest -> messRequest.getPrimaryId();
                case RoomVacancyRequest roomVacancyRequest -> roomVacancyRequest.getPrimaryId();
                case FoodStallRequest foodStallRequest -> foodStallRequest.getPrimaryId();
                case StudyRoomRequest studyRoomRequest -> studyRoomRequest.getPrimaryId();
                default -> null;
            };
        }

        static String getCity(Object listing) {
            if (listing == null) {
                return null;
            }
            return switch (listing) {
                case RoomRequest roomRequest -> roomRequest.getCity();
                case MessRequest messRequest -> messRequest.getCity();
                case RoomVacancyRequest roomVacancyRequest -> roomVacancyRequest.getCity();
                case FoodStallRequest foodStallRequest -> foodStallRequest.getCity();
                case StudyRoomRequest studyRoomRequest -> studyRoomRequest.getCity();
                default -> null;
            };
        }

        static String getSubType(Object listing) {
            if (listing == null) {
                return null;
            }
            return switch (listing) {
                case RoomRequest roomRequest -> roomRequest.getSubType();
                case MessRequest messRequest -> messRequest.getSubType();
                case RoomVacancyRequest roomVacancyRequest -> roomVacancyRequest.getSubType();
                case FoodStallRequest foodStallRequest -> foodStallRequest.getSubType();
                case StudyRoomRequest studyRoomRequest -> studyRoomRequest.getSubType();
                default -> null;
            };
        }

        static Double getLatitude(Object listing) {
            if (listing == null) {
                return null;
            }
            return switch (listing) {
                case RoomRequest roomRequest -> roomRequest.getLatitude();
                case MessRequest messRequest -> messRequest.getLatitude();
                case RoomVacancyRequest roomVacancyRequest -> roomVacancyRequest.getLatitude();
                case FoodStallRequest foodStallRequest -> foodStallRequest.getLatitude();
                case StudyRoomRequest studyRoomRequest -> studyRoomRequest.getLatitude();
                default -> null;
            };
        }

        static Double getLongitude(Object listing) {
            if (listing == null) {
                return null;
            }
            return switch (listing) {
                case RoomRequest roomRequest -> roomRequest.getLongitude();
                case MessRequest messRequest -> messRequest.getLongitude();
                case RoomVacancyRequest roomVacancyRequest -> roomVacancyRequest.getLongitude();
                case FoodStallRequest foodStallRequest -> foodStallRequest.getLongitude();
                case StudyRoomRequest studyRoomRequest -> studyRoomRequest.getLongitude();
                default -> null;
            };
        }

        static void setImages(Object listing, List<String> images) {
            if (listing == null) {
                return;
            }
            switch (listing) {
                case RoomRequest roomRequest -> roomRequest.setImages(images);
                case MessRequest messRequest -> messRequest.setImages(images);
                case RoomVacancyRequest roomVacancyRequest -> roomVacancyRequest.setImages(images);
                case FoodStallRequest foodStallRequest -> foodStallRequest.setImages(images);
                case StudyRoomRequest studyRoomRequest -> studyRoomRequest.setImages(images);
                default -> {
                }
            }
        }
    }
}
